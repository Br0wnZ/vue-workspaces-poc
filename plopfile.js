// plopfile.js
const execSync = require("child_process").execSync;
const fs = require("fs");
function addToPackage(name, dep = "--save") {
  return `npm install ${dep} --package-lock-only --no-package-lock ${name}`;
}
function addFile(file) {
  return {
    type: "add",
    path: "packages/{{name}}/" + file,
    templateFile: "plop-templates/createPackage/" + file,
    force: true,
  };
}
module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Generates a Vue component",
    prompts: [
      {
        type: "list",
        choices: ["apps", "packages"],
        name: "ui",
        message: "Do want to create a package or ui?",
      },
      {
        type: "input",
        name: "name",
        message: "Package name ",
        default: 'ui'
      },
      {
        type: "input",
        name: "component",
        message: "Component name, e.g. NatureBanner",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ui}}/{{name}}/{{pascalCase component}}/{{pascalCase component}}.vue",
        templateFile: "plop-templates/component.hbs",
      },
      {
        type: "add",
        path: "{{ui}}/{{name}}/{{pascalCase component}}/{{pascalCase component}}.spec.ts",
        templateFile: "plop-templates/component.test.hbs",
      },
      {
        type: "add",
        path: "{{ui}}/{{name}}/{{pascalCase component}}/{{pascalCase component}}.stories.js",
        templateFile: "plop-templates/component.stories.hbs",
      },
      {
        type: "modify",
        path: "{{ui}}/{{name}}/index.ts",
        skip: ({ ui }) => ui === "apps" ? 'Skipping add to index.ts': undefined,
        transform: function (fileContents, {component}) {
          const componentName = plop.handlebars.helpers.pascalCase(component)         
          const importValue =`\nexport {default as ${componentName}} from "./${componentName}/${componentName}.vue"`
          return fileContents + importValue ;
        },
      },
    ],
  });
  plop.setGenerator("CreateApp", {
    description: "Generates a Vue App",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "App Name name ",
      },
    ],
    actions: [
      function runCreateVue({ name }) {
        fs.mkdirSync(`./apps/${name}`, { recursive: true });
        const generateCommand = `npm init vue@3 ${name} -- --ts --router --pinia --tests --eslint --eslint-with-prettier`;
        execSync(`cd ./apps && ${generateCommand}`);
        return `App generated in apps/${name}`;
      },
      {
        type: "modify",
        path: "apps/{{name}}/package.json",
        pattern: /("version": *"0\.0\.0")/gi,
        template: '"name": "{{name}}",\r\n$1',
      },
      function addStorybook({name}){
        execSync(`cd ./apps/${name} && npx sb init --builder storybook-builder-vite`)
        return `Added storybook in apps/${name}`;
      },
      function addDeps({ name }) {
        const packages = ["vue-i18n@9.1.9", "ui-vue"];
        const packagesDev = ["@intlify/vite-plugin-vue-i18n"];
        packages.forEach((val) => {
          execSync(`cd ./apps/${name} && ${addToPackage(val)}`);
        });
        packagesDev.forEach((val) => {
          execSync(`cd ./apps/${name} && ${addToPackage(val, "--save-dev")}`);
        });
        return `Added vue-18n and ui-vue in apps/${name}`;
      },
      {
        type: "add",
        path: "apps/{{name}}/vite.config.ts",
        templateFile: "plop-templates/createApp/vite.config.ts",
        force: true,
      },
      {
        type: "add",
        path: "apps/{{name}}/tsconfig.json",
        templateFile: "plop-templates/createApp/tsconfig.json",
        force: true,
      },
      {
        type: "add",
        path: "apps/{{name}}/src/main.ts",
        templateFile: "plop-templates/createApp/main.ts",
        force: true,
      },
      {
        type: "add",
        path: "apps/{{name}}/src/locales/es.json",
        template: '{"HELLO":"Hola"}',
        force: true,
      },
      {
        type: "add",
        path: "apps/{{name}}/src/locales/en.json",
        template: '{"HELLO":"Hello"}',
        force: true,
      },
    ],
  });
  plop.setGenerator("Package", {
    description: "Generates a Vue lib package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name",
      },
    ],
    actions: [
      function runCreatePackage({ name }) {
        fs.mkdirSync(`./packages/${name}`, { recursive: true });

        return `App generated in packages/${name}`;
      },
      ...[
        "package.json",
        "tsconfig.json",
        "index.ts",
        "env.d.ts",
        ".storybook/main.js",
        ".storybook/preview.js",
      ].map((file) => addFile(file)),
      {
        type: "modify",
        path: "packages/{{name}}/package.json",
        pattern: /("version": *"0\.0\.0")/gi,
        template: '"name": "{{name}}",\r\n$1',
      },
    ],
  });
};
