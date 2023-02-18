// 匹配路径前缀 ./ ../ ..\ .\
const PATH_REG = /^(\.{0,2}[\/\\])/gm;
const FILESUF_REG = /.*(\.vue|js|jsx|ts|tsx)$/;

export type ImportModule = () => Promise<unknown>;
export type Modules = Record<string, ImportModule>;
export type ModulesMap = Map<string, ImportModule>;

export interface modulesOrganizeOptions {
  /**
   * @desc Remove unwanted path prefixes
   *
   * @default Reg: /^(\.{0,2}[\/\\])/gm
   */
  pathReg: string | RegExp;
}

export interface searchModuleComponentOptions {
  pathReg?: string | RegExp;
  filesueReg?: string | RegExp;
  defauleFile: string;
}

export type RouterAsyncRow = {
  meta: Record<string, string>;
  children?: RouterAsyncRow[];
  component: string;
};

/**
 *
 * @param modules `import.meta.glob("../views/**")`
 * @returns `Map<string, () => Promise<unknown>>`
 */
export function modulesOrganize(modules: Modules, options?: modulesOrganizeOptions) {
  const { pathReg } = Object.assign(options || {}, {
    pathReg: FILESUF_REG,
  });
  const modulesMap = new Map<string, ImportModule>();
  Object.entries(modules).forEach(([name, module]) => {
    modulesMap.set(name.replace(pathReg, ""), module);
  });
  return modulesMap;
}

/**
 *
 * @param modules Find a collection
 * @param componentName Find the target module name
 * @param options ```{ pathReg: /^(\.{0,2}[\/\\])/gm, filesueReg: /.*(\.vue|js|jsx|ts|tsx)$/, defauleFile: "index.vue" }```
 * @returns Modules found
 */
export function searchModuleComponent(modules: ModulesMap, componentName: string, options?: searchModuleComponentOptions): ImportModule | undefined {
  const { pathReg, filesueReg, defauleFile } = Object.assign(options || {}, {
    pathReg: PATH_REG,
    filesueReg: FILESUF_REG,
    defauleFile: "index.vue",
  });

  const isExt = filesueReg.test(componentName);
  // todo: 优化 (.vue) replace
  const componetName = (isExt ? componentName : componentName + ".vue").replace(PATH_REG, "");
  let module = modules.get(componetName);

  if (!module) {
    if (isExt) {
      // 文件没找到
      return undefined;
    } else {
      const newName = [componentName, defauleFile].join("/").replace(pathReg, "");
      let module = modules.get(newName);
      if (module) {
        return module;
      } else {
        // 文件没找到
        return undefined;
      }
    }
  }

  return module;
}
