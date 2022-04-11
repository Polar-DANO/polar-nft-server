export interface ERC721Metadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: {
    trait_type: string;
    value: string | number | boolean;
  }[];
  external_link: string;
}
