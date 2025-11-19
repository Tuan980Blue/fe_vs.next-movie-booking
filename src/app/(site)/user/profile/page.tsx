'use client'

import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/providers/AuthContext';
import { changePasswordApi, updateProfileApi } from "@/service";

interface EditForm {
    fullName: string;
    phone: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading, refreshMe } = useAuth();

    const formatDate = (value: string | undefined): string => {
        if (!value) return '-';
        try {
            return new Date(value).toLocaleString();
        } catch (_e) {
            return value;
        }
    };

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<EditForm>({ fullName: '', phone: '' });
    const [pwdForm, setPwdForm] = useState<PasswordForm>({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // Check if user is admin
    const isAdmin = user?.roles?.some(role => role.toLowerCase() === 'admin') || false;

    const startEdit = (): void => {
        setEditForm({ fullName: user?.fullName || '', phone: user?.phone || '' });
        setIsEditing(true);
    };

    const cancelEdit = (): void => setIsEditing(false);

    const onEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const startChangePwd = (): void => setIsChangingPassword(true);

    const cancelChangePwd = (): void => setIsChangingPassword(false);

    const onPwdChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPwdForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const payload = { fullName: editForm.fullName, phone: editForm.phone };
        try {
            await updateProfileApi(payload);
            // Gọi lại /users/me để đồng bộ đầy đủ (status/updatedAt/roles...)
            await refreshMe();
            setIsEditing(false);
        } catch (err) {
            alert('Cập nhật hồ sơ thất bại');
        }
    };

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (pwdForm.newPassword !== pwdForm.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp');
            return;
        }
        try {
            await changePasswordApi({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
            alert('Đổi mật khẩu thành công');
            setIsChangingPassword(false);
            setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert('Đổi mật khẩu thất bại');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-darkGray">Hồ sơ cá nhân</h1>
                <p className="text-neutral-darkGray/70 mt-1">Quản lý thông tin tài khoản của bạn.</p>
            </div>

            {isLoading ? (
                <div className="min-h-[120px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-pink"></div>
                </div>
            ) : !isAuthenticated || !user ? (
                <div className="text-center rounded-xl border border-neutral-lightGray/40 bg-white p-12 shadow-sm">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-neutral-darkGray mb-2">Bạn chưa đăng nhập</h2>
                    <p className="text-neutral-darkGray/70">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
                </div>
            ) : (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary-pink text-neutral-white flex items-center justify-center text-3xl font-bold">
                                            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-neutral-darkGray">{user.fullName || '-'}</h2>
                                            <p className="text-neutral-darkGray/70 text-sm">{user.email || '-'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isAdmin ? 'bg-primary-pink/10 text-primary-pink' : 'bg-neutral-lightGray/10 text-neutral-darkGray'}`}>
                                            {isAdmin ? 'Admin' : 'User'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-lightGray/30">
                                    <button onClick={startEdit} className="px-4 py-2 rounded-lg bg-primary-pink text-white hover:bg-primary-pink/90 transition-colors text-sm font-medium">Cập nhật hồ sơ</button>
                                    <button onClick={startChangePwd} className="px-4 py-2 rounded-lg bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10 transition-colors text-sm font-medium">Đổi mật khẩu</button>
                                </div>
                            </div>

                            {/* Edit Profile */}
                            {isEditing && (
                                <form onSubmit={handleSaveProfile} className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-neutral-darkGray/70 text-sm font-medium mb-2 block">Họ và tên</label>
                                        <input 
                                            name="fullName" 
                                            value={editForm.fullName} 
                                            onChange={onEditChange} 
                                            className="w-full px-4 py-2 border border-neutral-lightGray/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink text-neutral-darkGray" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-neutral-darkGray/70 text-sm font-medium mb-2 block">Điện thoại</label>
                                        <input 
                                            name="phone" 
                                            value={editForm.phone} 
                                            onChange={onEditChange} 
                                            className="w-full px-4 py-2 border border-neutral-lightGray/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink text-neutral-darkGray" 
                                        />
                                    </div>
                                    <div className="sm:col-span-2 flex gap-3">
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-pink text-white hover:bg-primary-pink/90 transition-colors text-sm font-medium">Lưu</button>
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10 transition-colors text-sm font-medium">Huỷ</button>
                                    </div>
                                </form>
                            )}

                            {/* Change Password */}
                            {isChangingPassword && (
                                <form onSubmit={handleChangePassword} className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-neutral-darkGray/70 text-sm font-medium mb-2 block">Mật khẩu hiện tại</label>
                                        <input 
                                            type="password" 
                                            name="currentPassword" 
                                            value={pwdForm.currentPassword} 
                                            onChange={onPwdChange} 
                                            className="w-full px-4 py-2 border border-neutral-lightGray/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink text-neutral-darkGray" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-neutral-darkGray/70 text-sm font-medium mb-2 block">Mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            value={pwdForm.newPassword} 
                                            onChange={onPwdChange} 
                                            className="w-full px-4 py-2 border border-neutral-lightGray/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink text-neutral-darkGray" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-neutral-darkGray/70 text-sm font-medium mb-2 block">Xác nhận mật khẩu</label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            value={pwdForm.confirmPassword} 
                                            onChange={onPwdChange} 
                                            className="w-full px-4 py-2 border border-neutral-lightGray/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink text-neutral-darkGray" 
                                        />
                                    </div>
                                    <div className="sm:col-span-3 flex gap-3">
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-pink text-white hover:bg-primary-pink/90 transition-colors text-sm font-medium">Đổi mật khẩu</button>
                                        <button type="button" onClick={cancelChangePwd} className="px-4 py-2 rounded-lg bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10 transition-colors text-sm font-medium">Huỷ</button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">ID</div>
                                    <div className="font-semibold text-neutral-darkGray break-all text-sm">{user.id || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Email</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.email || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Họ và tên</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.fullName || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Điện thoại</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.phone || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Trạng thái</div>
                                    <div className="font-semibold text-neutral-darkGray">{user.status === 1 ? 'Hoạt động' : user.status === 2 ? 'Không hoạt động' : user.status === 3 ? 'Bị cấm' : '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Vai trò</div>
                                    <div className="font-semibold text-neutral-darkGray capitalize">{user.roles?.[0] || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Tạo lúc</div>
                                    <div className="font-semibold text-neutral-darkGray text-sm">{formatDate(user.createdAt)}</div>
                                </div>
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm">
                                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Cập nhật lúc</div>
                                    <div className="font-semibold text-neutral-darkGray text-sm">{formatDate(user.updatedAt)}</div>
                                </div>
                                {Array.isArray(user.roles) && (
                                    <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-5 shadow-sm sm:col-span-2">
                                        <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Danh sách vai trò</div>
                                        <div className="font-semibold text-neutral-darkGray">
                                            {user.roles.length ? user.roles.join(', ') : '-'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
        </div>
    );
};

export default ProfilePage;