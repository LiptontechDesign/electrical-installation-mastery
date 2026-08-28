import { createCourseExtension, guidesFromModules } from './course-extension/builders';
import { module11 } from './course-extension/module-11';
import { module12 } from './course-extension/module-12';
import { module13 } from './course-extension/module-13';
import { module14 } from './course-extension/module-14';
import { module15 } from './course-extension/module-15';
import { module16 } from './course-extension/module-16';

const modules = [module11, module12, module13, module14, module15, module16];

const courseExtension = createCourseExtension(modules);

export const extensionGuides = guidesFromModules(modules);
export default courseExtension;
