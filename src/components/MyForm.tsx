import React from "react";
import MyInput from "./MyInput";
import { useSform } from "../hooks/useSform";
import { config } from "./config";

const MyForm = () => {
  const { field, values } = useSform(config);

  return (
    <div>
      <MyInput {...field("name")} />
      <MyInput {...field("lastname")} />
      <button onClick={() => console.log(values)}>Submit</button>
    </div>
  );
};

export default MyForm;
