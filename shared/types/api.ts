export interface ChallengeResponse {
  challenge: string
  difficulty: number
}

export interface CreatePostRequest {
  title: string
  content: string
  challenge: string
  nonce: string
}

export interface CreatePostResponse {
  id: string
  path: string
}

export interface PostView {
  id: string
  title: string
  html: string
  createdOn: string
}

export interface ApiErrorData {
  code: string
}
