export const hasFlag = (currentFlags: number, flag: number): boolean =>
	(currentFlags & flag) > 0;