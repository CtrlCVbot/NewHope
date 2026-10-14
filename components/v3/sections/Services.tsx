"use client";

import { useRef } from "react";
import type { V3Content } from "@/content/v3/types";
import { useReducedMotion } from "../motion/useReducedMotion";
import { ServiceCards } from "./ServiceCards";
import { ServicesLead } from "./ServicesLead";
import { ServicesStatement } from "./ServicesStatement";
import styles from "./services.module.css";

type Props = { id: string; services: V3Content["services"]; iconAssets?: string[] };

export function Services({ id, services, iconAssets }: Props) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  return <section id={id} ref={root} className={styles.services} data-v3-services data-services-root>
    <ServicesStatement statement={services.statement} statementBody={services.statementBody} reduced={reduced} />
    <ServicesLead label={services.label} headline={services.headline} points={services.points} image={services.image} reduced={reduced} />
    <ServiceCards cards={services.cards} cardsLabel={services.cardsLabel} reduced={reduced} iconAssets={iconAssets} />
  </section>;
}
