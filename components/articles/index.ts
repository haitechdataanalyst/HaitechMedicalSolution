import type { ArticleData } from "./articleTypes";
import { articleLoupeGuide } from "./article-loupe-guide";
import { articleLoupeMaintenance } from "./article-loupe-maintenance";
import { articleLoupeSelection } from "./article-loupe-selection";
import { articleErgoLoupes } from "./article-ergo-loupes";

export const articles: ArticleData[] = [
  articleLoupeGuide,
  articleLoupeMaintenance,
  articleLoupeSelection,
  articleErgoLoupes,
];

export { articleLoupeGuide, articleLoupeMaintenance, articleLoupeSelection, articleErgoLoupes };
export type { ArticleData };
