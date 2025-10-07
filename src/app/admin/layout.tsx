export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <ul className="space-y-2">
                    <li><a href="/admin">Dashboard</a></li>
                    <li><a href="/admin/users">Quản lý người dùng</a></li>
                </ul>
            </aside>
            <main className="flex-1 bg-gray-50 p-6">
                {children}
            </main>
        </div>
    );
}
