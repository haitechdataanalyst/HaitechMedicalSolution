/**
 * JSON-backed Frame Repository
 */

import { getAllFrames, getFrameById } from "@/lib/catalog";
import type { IFrameRepository } from "../interfaces";
import type { Frame } from "@/types";

export class JsonFrameRepository implements IFrameRepository {
    getAll(): Frame[] {
        return getAllFrames();
    }

    getById(id: string): Frame | null {
        return getFrameById(id);
    }
}
