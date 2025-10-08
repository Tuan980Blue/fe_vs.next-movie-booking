"use client"

import {useState} from "react";
import {changePasswordApi, updateProfileApi} from "@/service";
import { useAuth } from "@/context/AuthContext";
import type { ChangePasswordRequest, UpdateProfileRequest } from "@/models/user";

export default function UserProfilePage() {
    const { user, isAuthenticated, isLoading, refreshFromStorage } = useAuth();

    const formatDate = (value?: string) => {
        if (!value) return '-';
        try {
            return new Date(value).toLocaleString();
        } catch (_e) {
            return value;
        }
    };

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<Pick<UpdateProfileRequest, 'fullName' | 'phone'>>({ fullName: '', phone: '' });
    const [pwdForm, setPwdForm] = useState<{ currentPassword: string; newPassword: string; confirmPassword: string }>({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const startEdit = () => {
        setEditForm({ fullName: user?.fullName || '', phone: user?.phone || '' });
        setIsEditing(true);
    };
    const cancelEdit = () => setIsEditing(false);
    const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const startChangePwd = () => setIsChangingPassword(true);
    const cancelChangePwd = () => setIsChangingPassword(false);
    const onPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => setPwdForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload: UpdateProfileRequest = { fullName: editForm.fullName, phone: editForm.phone };
        try {
            await updateProfileApi(payload);
            // Đồng bộ lại auth state từ storage và /me
            await refreshFromStorage();
            setIsEditing(false);
        } catch (err) {
            alert('Cập nhật hồ sơ thất bại');
        }
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pwdForm.newPassword !== pwdForm.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp');
            return;
        }
        try {
            const payload: ChangePasswordRequest = { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword };
            await changePasswordApi(payload);
            alert('Đổi mật khẩu thành công');
            setIsChangingPassword(false);
            setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert('Đổi mật khẩu thất bại');
        }
    };

    return (
        <div className="min-h-screen py-16 px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-700 mb-4">👤 Thông tin cá nhân</h1>
                    <p className="text-neutral-700 opacity-75 text-lg">Quản lý thông tin tài khoản</p>
                </div>

                <div className="rounded-2xl p-8">
                    {isLoading ? (
                        <div className="min-h-[120px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-pink"></div>
                        </div>
                    ) : !isAuthenticated || !user ? (
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔒</div>
                            <h2 className="text-2xl font-bold text-neutral-darkGray mb-2">Bạn chưa đăng nhập</h2>
                            <p className="text-neutral-lightGray">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary-purple text-neutral-white flex items-center justify-center text-3xl">
                                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-neutral-darkGray">{user.fullName || '-'}</h2>
                                        <p className="text-neutral-lightGray">{user.email || '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${(((user?.roles||[])[0]||'').toLowerCase()==='admin') ? 'bg-green-100 text-green-700' : 'bg-neutral-lightGray text-neutral-darkGray'}`}>
                    {(((user?.roles||[])[0]||'').toLowerCase()==='admin') ? 'Admin' : 'User'}
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <button onClick={startEdit} className="px-4 py-2 rounded-lg bg-primary-purple text-neutral-white hover:opacity-90">Cập nhật hồ sơ</button>
                                <button onClick={startChangePwd} className="px-4 py-2 rounded-lg bg-accent-orange text-neutral-white hover:opacity-90">Đổi mật khẩu</button>
                            </div>

                            {/* Edit Profile */}
                            {isEditing && (
                                <form onSubmit={handleSaveProfile} className="border rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-neutral-lightGray text-sm mb-1">Họ và tên</div>
                                        <input name="fullName" value={editForm.fullName} onChange={onEditChange} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-lightGray text-sm mb-1">Điện thoại</div>
                                        <input name="phone" value={editForm.phone} onChange={onEditChange} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div className="sm:col-span-2 flex gap-3">
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-purple text-neutral-white hover:opacity-90">Lưu</button>
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-neutral-lightGray text-neutral-darkGray hover:opacity-90">Huỷ</button>
                                    </div>
                                </form>
                            )}

                            {/* Change Password */}
                            {isChangingPassword && (
                                <form onSubmit={handleChangePassword} className="border rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-neutral-lightGray text-sm mb-1">Mật khẩu hiện tại</div>
                                        <input type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={onPwdChange} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-lightGray text-sm mb-1">Mật khẩu mới</div>
                                        <input type="password" name="newPassword" value={pwdForm.newPassword} onChange={onPwdChange} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-lightGray text-sm mb-1">Xác nhận mật khẩu</div>
                                        <input type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={onPwdChange} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div className="sm:col-span-3 flex gap-3">
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-accent-orange text-neutral-white hover:opacity-90">Đổi mật khẩu</button>
                                        <button type="button" onClick={cancelChangePwd} className="px-4 py-2 rounded-lg bg-neutral-lightGray text-neutral-darkGray hover:opacity-90">Huỷ</button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">ID</div>
                                    <div className="font-semibold text-neutral-darkGray break-all">{user.id || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Email</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.email || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Họ và tên</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.fullName || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Điện thoại</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.phone || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Trạng thái</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.status || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Vai trò</div>
                                    <div className="font-semibold text-neutral-darkGray capitalize">{(user.roles && user.roles[0]) || '-'}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Tạo lúc</div>
                                    <div className="font-semibold text-neutral-darkGray">{formatDate(user.createdAt)}</div>
                                </div>
                                <div className="border rounded-xl p-5">
                                    <div className="text-neutral-lightGray text-sm mb-1">Cập nhật lúc</div>
                                    <div className="font-semibold text-neutral-darkGray">{formatDate(user.updatedAt)}</div>
                                </div>
                                {Array.isArray(user.roles) && (
                                    <div className="border rounded-xl p-5 sm:col-span-2">
                                        <div className="text-neutral-lightGray text-sm mb-1">Danh sách vai trò</div>
                                        <div className="font-semibold text-neutral-darkGray">
                                            {user.roles.length ? user.roles.join(', ') : '-'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
