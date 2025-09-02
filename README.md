# sir-form 📝

**Single Responsibility Form Handler** – An elegant and fully typed way to handle forms in React, based on **constraints** and **messages**, designed to showcase architecture, abstraction, and advanced TypeScript skills.

---

## Main Idea

Instead of focusing on errors (`errors`) and `isValid`, this library proposes:

- **Constraints**: pure transformations applied to form values in real-time.  
  Example: removing invalid characters, formatting text, normalizing values.  
- **Messages**: feedback about field values that can include errors, warnings, or tips.  
- **Separation of responsibilities**:  
  - Each field only handles presentation.  
  - Behavior and validation logic are centralized in the configuration.  
- **Reusability**: field configurations can be shared across projects or forms to ensure consistency and standards.

---

## Installation (Portfolio Use)

> Note: This project is a portfolio, not published to npm.  
> You can clone it and run it locally:

```bash
git clone https://github.com/hual/sir-form.git
cd sir-form
npm install
npm start
```

---

## Usage

### Field configuration

```ts
// Name field configuration
export const nameField = {
  type: "text",
  messages: {
    test: (arg: string) => /a/.test(arg),
    message: "Must contain the letter 'a'",
  },
  constraints: (arg: string) => arg.replace("i", ""),
  props: { label: "Name", disabled: false },
};

// Lastname field configuration
export const lastnameField = {
  type: "text",
  constraints: (arg: string) => arg.replace("h", ""),
  messages: [
    { test: (arg: string) => /e/.test(arg), message: "Must contain 'e'" }
  ],
};

// Complete form configuration
export const config = {
  fields: { name: nameField, lastname: lastnameField },
  globalConstraints: [
    ({ name, lastname }) => ({ name, lastname: lastname.toUpperCase() })
  ],
  globalMessages: {
    test: ({ name, lastname }) => !(/[A-Z]/.test(name) || /[A-Z]/.test(lastname)),
    message: { name: "At least one field must have an uppercase letter" }
  },
};
```

### Usage in React component

```tsx
import React from "react";
import MyInput from "./MyInput";
import { useSform } from "./useSform";
import { config } from "./expForm";

const MyForm = () => {
  const { field, values, messages } = useSform(config);

  return (
    <div>
      <MyInput {...field("name")} />
      <MyInput {...field("lastname")} />
      <button onClick={() => console.log(values)}>Submit</button>
    </div>
  );
};

export default MyForm;
```

---

## Key Features

- Advanced TypeScript typing.  
- Form lifecycle: `onChange` → individual constraints → global constraints → individual messages → global messages → props.  
- Clear separation of UI and behavior logic.  
- Reusable and standardized field configurations.  
- Messages are not limited to errors; they can be warnings or tips.  

---

## Portfolio Advantages

- Demonstrates **architecture and advanced TypeScript skills**.  
- Introduces a **new conceptual approach to forms**.  
- Clean, modular, and easy-to-understand code.

---

## Future Improvements (Optional)

- Optimize performance for large forms.  
- Support other events (`onBlur`, `onFocus`, `onSubmit`).  
- Publish as a real npm library.
