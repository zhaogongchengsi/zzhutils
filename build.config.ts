import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    {
      input: "./packages/vite/src/index.ts",
      name: "vite",
    },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});
