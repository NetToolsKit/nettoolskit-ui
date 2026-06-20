export default {
  ignoreFiles: [
    'src/design-system/tokens/generated.css',
    'src/design-system/tokens/generated/tokens.css',
  ],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'function-calc-no-unspaced-operator': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'no-invalid-position-at-import-rule': true,
    'property-no-unknown': true,
    'selector-anb-no-unmatchable': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
    'selector-pseudo-element-no-unknown': true,
    'string-no-newline': true,
    'unit-no-unknown': true,
  },
}