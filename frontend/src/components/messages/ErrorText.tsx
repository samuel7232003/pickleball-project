import css from "./ErrorText.module.css"

export default function ErrorText(props:any){
  const {errorElement = css.error, content} = props;
  if(content === "") return null;
  return (
    <p className={errorElement}>{content}</p>
  )
}