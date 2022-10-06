import {Language} from "./Language";
import {ProtocolAmendmentInstruction} from "./ProtocolAmendmentInstruction";

export interface ILanguageUnifier {
    unify(oldLang: Language, newLang: Language, instruction: ProtocolAmendmentInstruction): Language
}
