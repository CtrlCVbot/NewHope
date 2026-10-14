import { GoldLabel } from "../ui/GoldLabel";
import { Icon } from "../ui/Icon";
import styles from "./extras.module.css";

type Story = { date: string; category: string; title: string; id: string; href: string };
type Props = { id?: string; stories: Story[]; storyNotice: string };

export function Stories({ id = "stories", stories, storyNotice }: Props) {
  return <section id={id} className={styles.stories} data-v3-stories>
    <div className={styles.inner}>
      <header className={styles.sectionHeader}>
        <GoldLabel>센터 소식</GoldLabel>
        <h2>센터가 전하는 제도·운영 정보입니다.</h2>
        <p className={styles.note}>{storyNotice}</p>
      </header>
      <ul className={styles.storyList} aria-label="센터 소식 목록">
        {stories.map((story) => <li key={story.id}>
          <a className={styles.story} href={story.href} target="_blank" rel="noreferrer" data-story-id={story.id}>
            <time dateTime={story.date.replaceAll(". ", "-").replace(/\.$/, "")}>{story.date}</time>
            <span>{story.category}</span><strong>{story.title}</strong><Icon name="arrow-up-right" />
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
