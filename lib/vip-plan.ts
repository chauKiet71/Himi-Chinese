export const LIFETIME_VIP_PLAN_CODE = "VIP_LIFETIME";
export const LIFETIME_VIP_STORAGE_DAYS = 3_650;
export const TRIAL_VIP_PLAN_CODE = "VIP_3D";

export function isLifetimeVipPlan(planCode: string): boolean {
  return planCode.trim().toUpperCase() === LIFETIME_VIP_PLAN_CODE;
}

export function isTrialVipPlan(planCode: string, durationDays: number): boolean {
  return planCode.trim().toUpperCase() === TRIAL_VIP_PLAN_CODE || durationDays === 3;
}

export function vipPlanDurationLabel(planCode: string, durationDays: number): string {
  return isLifetimeVipPlan(planCode) ? "Vĩnh viễn" : `${durationDays} ngày`;
}

export function vipPlanAccessLabel(planCode: string, durationDays: number): string {
  return isLifetimeVipPlan(planCode) ? "Quyền truy cập vĩnh viễn" : `${durationDays} ngày sử dụng`;
}
