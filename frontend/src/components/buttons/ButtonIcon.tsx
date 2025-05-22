export default function ButtonIcon(props: any) {
  const { onClick, mainElement, icon, content } = props;
  return (
    <div onClick={onClick} className={mainElement}>
      {icon && (
        <figure>
          <img src={icon} alt="" />
        </figure>
      )}
      {content && <p>{content}</p>}
    </div>
  );
}
