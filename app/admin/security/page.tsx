import { AdminConsoleHeader } from "@/components/admin-console";
import { AdminTotpSettings } from "@/components/admin-totp-settings";
import { requirePracticeStaffUser } from "@/lib/admin-auth";
import { getAdminTotpStatus } from "@/lib/admin-totp";
import { totpEncryptionConfigured } from "@/lib/totp-crypto";

export const metadata = { title: "Bảo mật tài khoản Console" };
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await requirePracticeStaffUser();
  const status = await getAdminTotpStatus(user.id);
  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader title="Bảo mật tài khoản" eyebrow="Himi Chinese Console" userName={user.displayName}
      description="Quản lý phương thức xác minh khi đăng nhập tài khoản Console của bạn." />
    <AdminTotpSettings initiallyEnabled={status.enabled} configured={totpEncryptionConfigured()} />
  </div></main>;
}
