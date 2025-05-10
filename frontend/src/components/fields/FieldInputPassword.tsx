import { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function FieldInputPassword(props: any) {
  const {
    blockElement,
    titleElement,
    title,
    inputElement,
    inputPlaceholder,
    onChange,
    value = "",
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={blockElement}>
      <p className={titleElement}>{title}</p>
      <fieldset className={inputElement}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={inputPlaceholder}
          onChange={onChange}
          value={value}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer", padding: "0 8px", position: "absolute", right: "25px", bottom: "20px"}}
        >
          {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
        </span>
      </fieldset>
    </div>
  );
}
