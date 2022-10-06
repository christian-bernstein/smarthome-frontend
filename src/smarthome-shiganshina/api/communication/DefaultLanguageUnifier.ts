import {ILanguageUnifier} from "./ILanguageUnifier";
import {Language} from "./Language";
import {ProtocolAmendmentInstruction} from "./ProtocolAmendmentInstruction";
import {PacketHandler} from "./PacketHandler";

export class DefaultLanguageUnifier implements ILanguageUnifier {

    public unify(oldLang: Language, newLang: Language, instruction: ProtocolAmendmentInstruction): Language {
        const overwrite: boolean = instruction.unifierPolicy === "overwrite";

        newLang.forEach((handler, id) => {
            const oldLangEntry: PacketHandler<any> | undefined = oldLang.get(id);
            if (oldLangEntry !== undefined) {
                // Handler for packet 'id' is defined in both languages
                if (overwrite) {
                    // TODO: Call special on delete function in oldLangEntry
                    oldLang.delete(id);
                    oldLang.set(id, handler);
                }
            }
        });

        return new Map<string, PacketHandler<any>>(oldLang.entries());
    }
}
