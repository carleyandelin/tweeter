

export interface IS3DAO {
  putImage(fileName: string, imageBase64: string): Promise<string>;
}
