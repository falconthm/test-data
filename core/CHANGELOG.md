# @commercetools-test-data/core

## 1.0.1
### Patch Changes



- [`53fbe8d`](https://github.com/commercetools/test-data/commit/53fbe8dbd27446a4c16d293ee333bd476c7c8c90) [#4](https://github.com/commercetools/test-data/pull/4) Thanks [@emmenko](https://github.com/emmenko)! - Fix transformer types. Now the `replaceFields` option takes precedence as the return value can be of any type.
  If the `addFields` and `removeFields` options are also provided together with the `replaceFields` option, a warning will be logged.