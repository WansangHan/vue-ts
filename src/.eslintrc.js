module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
  ],
  env: {
    'vue/setup-compiler-macros': true, // defineProps, defineEmits 지원 추가
  },
  parserOptions: {
    ecmaVersion: 2020, // 최신 ECMAScript 문법 지원
    sourceType: 'module', // ES 모듈 지원
  },
  rules: {
    // 필요시 커스텀 규칙 추가
  },
};
