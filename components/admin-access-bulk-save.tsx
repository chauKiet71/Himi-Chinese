"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";

function SaveButton() {
  const { pending } = useFormStatus();
  return <button className="button button-primary" disabled={pending} type="submit">
    <Save aria-hidden="true" size={17} /> {pending ? "Đang lưu…" : "Lưu"}
  </button>;
}

export function AdminAccessBulkSave({ action, children, returnTo }: {
  action: (data: FormData) => Promise<void>;
  children: ReactNode;
  returnTo: string;
}) {
  const fields = useRef<HTMLFieldSetElement>(null);
  const [saving, setSaving] = useState(false);

  async function saveAll(data: FormData) {
    const forms = fields.current?.querySelectorAll<HTMLFormElement>("form.admin-access-form") ?? [];
    const policies = Array.from(forms, (form) => {
      const values = new FormData(form);
      return { targetType: values.get("targetType"), targetKey: values.get("targetKey"), tier: values.get("tier") };
    });
    data.set("policies", JSON.stringify(policies));
    setSaving(true);
    try { await action(data); } finally { setSaving(false); }
  }

  return <div className="admin-access-bulk-save">
    <div className="admin-access-bulk-toolbar">
      <p>Lưu tất cả trạng thái đang chọn của cấp độ, bài học và các mục trong bài.</p>
      <form action={saveAll}>
        <input name="returnTo" type="hidden" value={returnTo} />
        <SaveButton />
      </form>
    </div>
    <fieldset aria-busy={saving} aria-label="Quyền truy cập bài học" className="admin-access-bulk-fields" disabled={saving} ref={fields}>
      {children}
    </fieldset>
  </div>;
}
