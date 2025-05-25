import text from "../../../util/text";
import css from "./NoteTimeslotChoice.module.css";
import classNames from "classnames";

export default function NoteTimeslotChoice(props: any) {
  const { mainElement} = props;

  const mainClass = classNames(css.main, mainElement);

  return (
    <div className={mainClass}>
      <p>{text["DetailCourt.noteAvailable"]}</p>
      <p>{text["DetailCourt.noteUnavailable"]}</p>
      <p>{text["DetailCourt.notePendding"]}</p>
      <p>{text["DetailCourt.noteChoiced"]}</p>
    </div>
  );
}