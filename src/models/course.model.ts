import Recording from "./recording.model";

export default interface Course {
  id: string;
  name: string;
  teachers: Array<string>;
  recordings: Array<Recording>;
}
