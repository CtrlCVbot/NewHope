import { useId } from "react";
import { Icon } from "../ui/Icon";
import styles from "./extras.module.css";

type FaqItem = { question: string; answer: string };
type Props = { id?: string; faq: FaqItem[] };

export function Faq({ id = "faq", faq }: Props) {
  const instanceId = useId().replace(/:/g, "");
  const groupName = `${id}-${instanceId}`;
  return <section id={id} className={styles.faq} data-v3-faq><div className={styles.faqInner}>
    <header className={styles.sectionHeader}><p className={styles.kicker}>FAQ</p><h2>먼저 궁금한 이야기들입니다.</h2></header>
    <div className={styles.faqList}>{faq.map((item, index) => {
      const itemId = `${groupName}-item-${index + 1}`;
      return <details key={item.question} id={itemId} name={groupName} className={styles.faqItem}>
        <summary aria-controls={`${itemId}-answer`}><span>{item.question}</span><span className={styles.faqIcon} aria-hidden="true"><Icon name="plus" className={styles.plus} /><Icon name="close" className={styles.close} /></span></summary>
        <p id={`${itemId}-answer`}>{item.answer}</p>
      </details>;
    })}</div>
  </div></section>;
}
