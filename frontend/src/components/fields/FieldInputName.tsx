export default function FieldInputName(props: any) {
  const {
    blockElement,
    titleElement,
    title,
    inputElementBox,
    inputElement,
    inputPlaceholderFirstName,
    inputPlaceholderLastName,
    onChangeFirstName,
    onChangeLastName,
    valueFirstName= "",
    valueLastName= "",
  } = props;
  return (
    <div className={blockElement}>
      <p className={titleElement}>{title}</p>
      <div className={inputElementBox}>
        <fieldset className={inputElement}>
          <input placeholder={inputPlaceholderLastName} onChange={onChangeLastName}  value={valueLastName}/>
        </fieldset>
        <fieldset className={inputElement}>
          <input placeholder={inputPlaceholderFirstName} onChange={onChangeFirstName}  value={valueFirstName}/>
        </fieldset>
      </div>
    </div>
  );
}
