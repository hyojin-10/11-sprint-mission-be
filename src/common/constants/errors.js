// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  // 공통
  BAD_REQUEST: '잘못된 요청입니다.',
  UNAUTHORIZED: '로그인이 필요한 서비스입니다.',
  FORBIDDEN: '해당 작업에 대한 권한이 없습니다.',
  NOT_FOUND: '요청하신 데이터를 찾을 수 없습니다.',
  CONFLICT: '이미 존재하는 데이터입니다.',
  INVALID_ID_FORMAT: '잘못된 ID 형식입니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',

  // 인증 및 권한
  NO_AUTH_TOKEN: '인증 토큰이 없습니다.',
  INVALID_TOKEN: '유효하지 않거나 만료된 토큰입니다.',
  USER_NOT_FOUND_FROM_TOKEN: '해당 토큰의 사용자를 찾을 수 없습니다.',
  AUTH_FAILED: '인증에 실패했습니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  NOT_YOUR_CONTENT: '본인의 콘텐츠만 수정/삭제할 수 있습니다.',

  // 유효성 검사
  INVALID_INPUT: '입력값이 올바르지 않습니다.',
  VALIDATION_FAILED: '유효성 검사에 실패했습니다.',
  UPDATE_FIELD_REQUIRED: '수정할 항목을 최소 1개 이상 입력해주세요.',

  // 유저
  USER_NOT_FOUND: '존재하지 않는 사용자입니다.',
  EMAIL_REQUIRED: '이메일을 입력해주세요.',
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  NICKNAME_REQUIRED: '닉네임은 필수입니다.',
  NICKNAME_ALREADY_EXISTS: '이미 사용 중인 닉네임입니다.',
  NICKNAME_MIN: '닉네임은 2자 이상이어야 합니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_WRONG: '비밀번호가 일치하지 않습니다.',
  PASSWORD_MIN: '비밀번호를 8자 이상 입력해주세요.',

  // 게시글
  ARTICLE_NOT_FOUND: '게시글을 찾을 수 없습니다.',
  TITLE_REQUIRED: '제목은 필수 항목입니다.',
  TITLE_MAX: '제목은 100자 이내로 입력해주세요.',
  CONTENT_REQUIRED: '본문 내용을 입력해주세요.',

  // 상품
  PRODUCT_NOT_FOUND: '해당 상품을 찾을 수 없습니다.',
  PRODUCT_NAME_REQUIRED: '상품명은 필수입니다.',
  PRODUCT_NAME_MAX: '상품명은 10자 이내로 입력해주세요.',
  PRICE_REQUIRED: '가격은 필수이며 숫자여야 합니다.',
  PRICE_MIN: '가격은 0원 이상이어야 합니다.',
  DESCRIPTION_REQUIRED: '상품 소개는 필수입니다.',
  DESCRIPTION_MIN: '상품 소개는 10자 이상 입력해주세요.',
  TAG_MAX: '태그는 5글자 이내로 입력해주세요.',

  // 이미지
  IMAGE_MAX_COUNT: '이미지는 최대 3장까지만 등록 가능합니다.',
  INVALID_IMAGE_FORMAT: '이미지 형식이 올바르지 않습니다.',

  // 댓글
  COMMENT_NOT_FOUND: '댓글을 찾을 수 없습니다.',
  COMMENT_CONTENT_REQUIRED: '댓글 내용을 입력해주세요.',

  // 검색
  SEARCH_QUERY_REQUIRED: '검색어를 입력해주세요.',
  FAILED_TO_SEARCH: '검색 결과를 가져오는 중 문제가 발생했습니다.',
};

// 성공 메시지 상수
export const SUCCESS_MESSAGE = {
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  CREATE_SUCCESS: '성공적으로 등록되었습니다.',
  UPDATE_SUCCESS: '성공적으로 수정되었습니다.',
  DELETE_SUCCESS: '정상적으로 삭제되었습니다.',
  LIKE_SUCCESS: '좋아요가 반영되었습니다.',
  UNLIKE_SUCCESS: '좋아요가 취소되었습니다.',
};
