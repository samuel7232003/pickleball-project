import React from "react";
import classNames from "classnames";
import css from "./ButtonIcon.module.css";

export default function ButtonIcon(props: any) {
  const { onClick, mainElement, icon, content, isDisabled, isLoading } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled && !isLoading) {
      onClick?.(e);
    }
  };

  const classes = classNames(mainElement, {
    [css.disabled]: isDisabled,
    [css.loading]: isLoading,
  });

  return (
    <div onClick={handleClick} className={classes}>
      {icon && !isLoading && (
        <figure>
          <img src={icon} alt="" />
        </figure>
      )}
      {isLoading ? (
        <div className={css.spinner}></div>
      ) : (
        content && <p>{content}</p>
      )}
    </div>
  );
}
