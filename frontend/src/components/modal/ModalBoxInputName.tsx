import { Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import styles from "./ModalBoxInputName.module.css";

export default function ModalBoxInput(props: any) {
  const { open, onClose, title, placeholderFirstName, placeholderLastName, textError, firstName, lastName } = props;
  const [valueFirstName, setValueFirstName] = useState("");
  const [valueLastName, setValueLastName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(firstName && lastName) {
      setValueFirstName(firstName);
      setValueLastName(lastName);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    if(open) {
      setIsLoading(false);
    }
  }, [open]);


  const handleOk = () => {
    if (valueFirstName === "" || valueLastName === "") {
      messageApi.error(textError);
      return;
    }
    setIsLoading(true);
    onClose({ first_name: valueFirstName, last_name: valueLastName });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        title={title}
        onOk={handleOk}
        confirmLoading={isLoading}
      >
        <div className={styles.inputContainer}> 
          <Input
            placeholder={placeholderLastName}
            value={valueLastName}
            onChange={(e) => setValueLastName(e.target.value)}
          />
          <Input
            placeholder={placeholderFirstName}
            value={valueFirstName}
            onChange={(e) => setValueFirstName(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
