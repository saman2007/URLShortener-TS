export type ModalType = "none" | "error" | "loading" | "success";
export interface ModalDescriptor {
  type: ModalType;
  msg: string;
}
