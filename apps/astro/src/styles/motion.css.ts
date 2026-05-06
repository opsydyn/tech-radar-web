export const motionDurationMedium = "300ms";
export const motionEaseEmphasized = "cubic-bezier(0.32, 0.72, 0, 1)";
export const motionEaseStandard = "ease";

export const motionTransformTransition = `transform ${motionDurationMedium} ${motionEaseEmphasized}`;
export const motionTransformOpacityTransition = `transform ${motionDurationMedium} ${motionEaseEmphasized}, opacity ${motionDurationMedium} ${motionEaseStandard}`;
export const motionTransformSurfaceTransition = `transform ${motionDurationMedium} ${motionEaseEmphasized}, background-color ${motionDurationMedium} ${motionEaseStandard}, border-color ${motionDurationMedium} ${motionEaseStandard}, box-shadow ${motionDurationMedium} ${motionEaseStandard}, color ${motionDurationMedium} ${motionEaseStandard}`;
export const motionSurfaceTransition = `background-color ${motionDurationMedium} ${motionEaseStandard}, border-color ${motionDurationMedium} ${motionEaseStandard}, box-shadow ${motionDurationMedium} ${motionEaseStandard}, color ${motionDurationMedium} ${motionEaseStandard}`;
export const motionColorTransition = `color ${motionDurationMedium} ${motionEaseStandard}`;
export const motionWidthTransition = `width ${motionDurationMedium} ${motionEaseEmphasized}`;
