export default function FieldInputText(props: any) {
  const {
    blockElement,
    titleElement,
    title,
    inputElement,
    inputPlaceholder,
    onChange,
    value= "",
  } = props;
  return (
    <div className={blockElement}>
      <p className={titleElement}>{title}</p>
      <fieldset className={inputElement}>
        <input placeholder={inputPlaceholder} onChange={onChange}  value={value}/>
      </fieldset>
    </div>
  );
}
