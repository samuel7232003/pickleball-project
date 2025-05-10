import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function ButtonText(props: any) {
  const {
    buttonElement,
    content,
    contentElement,
    handleOnClick,
    loading = false,
  } = props;

  return (
    <div className={buttonElement} onClick={handleOnClick}>
      <div className={contentElement}>
        {!loading ? (
          content
        ) : (
          <Spin indicator={<LoadingOutlined spin />} size="small" />
        )}
      </div>
    </div>
  );
}
