import type { ConsultationGuide as ConsultationGuideData } from "@/content/v3/types";
import { CtaButton } from "../ui/CtaButton";
import styles from "./cta-section.module.css";

type Props = { id?: string; guide: ConsultationGuideData };

export function ConsultationGuide({ id = "consult", guide }: Props) {
  return <aside id={id} className={styles.consultationGuide} data-v3-consult aria-label={guide.label}>
    <p className={styles.consultationNotice}>{guide.notice}</p>
    <CtaButton href={guide.button.href} variant="gold" data-v3-consult-button>{guide.button.label}</CtaButton>
  </aside>;
}
