/**
 * Example field configurations and full form config for `sir-form`
 */

/**
 * Individual field configuration
 * Each field can have:
 * - type: HTML input type
 * - messages: validation or informational messages (single or array)
 * - constraints: function(s) to transform the field value automatically
 * - props: additional props passed to the input component (label, disabled, etc.)
 */
export const nameField = {
  initialValue: "text",
  messages: {
    test: (value: string) => /a/.test(value), // test if value contains "a"
    message: "Must not contain the letter 'a'", // message to show if test passes
  },
  constraints: (value: string) => value.replace("i", ""), // remove "i" from input automatically
  props: { label: "Name", disabled: false }, // additional input props
};

export const lastnameField = {
  initialValue: "text2",
  constraints: (value: string) => value.replace("h", ""), // remove "h" from input
  messages: [
    {
      test: (value: string) => /e/.test(value), // test if value contains "e"
      message: "Must contain 'e'", // message if test passes
    },
  ],
};

/**
 * Full form configuration
 * - fields: object containing all field configurations
 * - globalConstraints: array or single function to apply transformations at the form level
 * - globalMessages: array or single function to generate messages depending on the whole form
 */
export const config = {
  fields: { name: nameField, lastname: lastnameField },
  globalConstraints: [
    // example: convert lastname to uppercase automatically
    ({ name, lastname }: { name: string; lastname: string }) => ({
      name,
      lastname: lastname.toUpperCase(),
    }),
  ],
  globalMessages: {
    // example: check that at least one field has an uppercase letter
    test: ({ name, lastname }: { name: string; lastname: string }) =>
      !(/[A-Z]/.test(name) || /[A-Z]/.test(lastname)),
    message: {
      name: "At least one field must have an uppercase letter",
      lastname: "At least one field must have an uppercase letter",
    },
  },
};
