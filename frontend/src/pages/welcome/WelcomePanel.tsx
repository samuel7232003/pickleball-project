import text from "../../util/text";

const range = (n: number): number[] => {
  return Array.from({ length: n }, (_, i) => i + 1);
};

const contentMap = (num: number) => {
  switch (num) {
    case 1:
    case 2:
    case 3:
      return text[`Welcome.content${num}` as keyof typeof text];
    default:
      return text[`Welcome.content3`];
  }
};

export default function WelcomePanel(props: any) {
  const {
    panelElement,
    panelTitleElement,
    panelContentElement,
    panelIconElement,
    panelIcon,
    numContent = 3,
  } = props;

  const ContentItem = (num: number) => {
    const getTran = (num: number) => {
      return { transform: `translateX(${num * 15}px)` };
    };

    return (
      <div style={getTran(num)} key={num}>
        <figure className={panelIconElement}>
          <img src={panelIcon} alt="" />
        </figure>
        <p>{contentMap(num)}</p>
      </div>
    );
  };

  const PanelContent = () => {
    const list = range(numContent);

    return (
      <div className={panelContentElement}>
        {list.map((num) => ContentItem(num))}
      </div>
    );
  };

  return (
    <div className={panelElement}>
      <h2 className={panelTitleElement}>{text["Welcome.title"]}</h2>
      <PanelContent />
    </div>
  );
}
