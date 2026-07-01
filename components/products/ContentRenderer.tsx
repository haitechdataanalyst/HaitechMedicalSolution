import { ContentBlock, Product, Frame, HeadlightCategory } from "@/types";
import { HeroBlock, DescriptionBlock, SpecificationsTable, ActionsBlock, GalleryBlock } from "./blocks";

interface ContentRendererProps {
    blocks: ContentBlock[];
    product: Product;
    section?: "left" | "right" | "all";
    selectedVariantImage?: string;
    onVariantSelect?: (imageUrl: string) => void;
    frames?: Frame[];
    headlightCategories?: HeadlightCategory[];
}

// Define which blocks go in which section for the product layout
const leftSectionBlocks = ["hero", "gallery"];
const rightSectionBlocks = ["description", "actions"];
const bottomSectionBlocks = ["specifications", "info"];

export default function ContentRenderer({ blocks, product, section = "all", selectedVariantImage, onVariantSelect, frames = [], headlightCategories = [] }: ContentRendererProps) {
    const filteredBlocks = blocks.filter((block) => {
        if (section === "all") return true;
        if (section === "left") return leftSectionBlocks.includes(block.type);
        if (section === "right") return rightSectionBlocks.includes(block.type) || bottomSectionBlocks.includes(block.type);
        return false;
    });

    return (
        <div className="space-y-8">
            {filteredBlocks.map((block, index) => {
                switch (block.type) {
                    case "hero":
                        return <HeroBlock key={index} data={block.data} product={product} externalSelectedImage={selectedVariantImage} />;
                    case "description":
                        return <DescriptionBlock key={index} data={block.data} />;
                    case "specifications":
                        return <SpecificationsTable key={index} data={block.data} />;
                    // case "info":
                    //   return <InfoBlock key={index} data={block.data} />;
                    case "actions":
                        return <ActionsBlock key={index} data={block.data} product={product} onVariantSelect={onVariantSelect} frames={frames} headlightCategories={headlightCategories} />;
                    case "gallery":
                        return <GalleryBlock key={index} data={block.data} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
