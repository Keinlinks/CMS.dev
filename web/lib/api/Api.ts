/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UpdateUserDto {
  /**
   * First name of the user.
   * @example "John"
   */
  name?: string | null;
  /** @example "Doe" */
  lastname?: string | null;
}

export interface CreateTestimonialDto {
  /**
   * Email of the client submitting the testimonial.
   * @example "client_1@example.com"
   */
  client_email?: string;
  /**
   * Name of the client submitting the testimonial.
   * @example "John Doe"
   */
  client_name: string;
  /**
   * ID of the organization submitting the testimonial.
   * @example "org_12345"
   */
  organization_id: string;
  /**
   * Title of the testimonial (between 3 and 255 characters).
   * @minLength 3
   * @maxLength 255
   * @example "Amazing service!"
   */
  title: string;
  /**
   * Main content of the testimonial.
   * @example "The experience was incredible and the staff was very helpful."
   */
  content: string;
  /**
   * Type of media attached to the testimonial.
   * @default "text"
   * @example "text"
   */
  media_type?: "image" | "video" | "text";
  /**
   * Star rating for the testimonial. Must be an integer between 1 and 5.
   * @min 1
   * @max 5
   * @example 5
   */
  stars_rating?: number;
  /** @example ["ec97b2a3-5b9e-4c11-8ec9-2f7b4e9af8d4","57c4c242-9f67-4d7a-b122-33cf10c1e3d0"] */
  tagIds?: string[];
}

export interface TestimonialResponseDto {
  /**
   * Unique ID of the testimonial
   * @example "0b28b9ad-03c8-472d-8c3a-a21d5f04a6c3"
   */
  id: string;
  /**
   * Name of the client who provided the testimonial
   * @example "John Doe"
   */
  client_name: string;
  /**
   * Email of the client who provided the testimonial
   * @example "client_1@example.com"
   */
  client_email: string;
  /**
   * Organization ID for which the testimonial was submitted
   * @example "org_12345"
   */
  organitation_id: string;
  /**
   * Category ID linked to the testimonial
   * @example "c0f9c216-2e9d-49b9-836f-3c40a0d7f023"
   */
  category_id: string;
  /**
   * Title of the testimonial
   * @example "Amazing service!"
   */
  title: string;
  /**
   * Main content of the testimonial
   * @example "Excellent work and great customer attention."
   */
  content: string;
  /**
   * Optional URL of a media asset attached to the testimonial
   * @example "https://cdn.myapp.com/media/testimonial123.jpg"
   */
  media_url?: string;
  /**
   * Media type associated with the testimonial
   * @example "IMAGE"
   */
  media_type?: string;
  /**
   * Status of the testimonial publication
   * @example "PUBLISHED"
   */
  status?: string;
  /**
   * Star rating from 1 to 5
   * @example 5
   */
  stars_rating?: number;
  /**
   * Associated tag IDs
   * @example ["ec97b2a3-5b9e-4c11-8ec9-2f7b4e9af8d4","57c4c242-9f67-4d7a-b122-33cf10c1e3d0"]
   */
  tagIds?: string[];
  /**
   * Category name (optional resolution)
   * @example "Customer Service"
   */
  category_name?: string;
}

export interface InviteTestimonialDto {
  /**
   * List of email addresses to send the testimonial invitation to.
   * @example ["customer1@mail.com","customer2@mail.com"]
   */
  emails: string[];
  /** Category ID associated with testimonials. */
  categoryId: string;
  /**
   * Organization ID that is sending the testimonial request.
   * @example "c2ca55c2-d033-4320-a7b4-fb096b0db9e2"
   */
  organizationId: string;
}

export type ChangeStatusDto = object;

export interface CreateOrganizationDto {
  /**
   * Name of the Organization
   * @example "Organization_1"
   */
  name: string;
  /**
   * Name of the Organization
   * @example "Organization_1 is focused on delivering quality products."
   */
  description?: string;
  /**
   * Question text displayed to the end user (editable by admin)
   * @example "What did you think of this experience?"
   */
  questionText?: string;
}

export type UpdateOrganizationDto = object;

export type AddUserOrganizationDto = object;

export type ChangeRoleDto = object;

export type CreateTagDto = object;

export type UpdateTagDto = object;

export interface LoginDto {
  /**
   * Username
   * @example "johndoe"
   */
  username: string;
  /**
   * Password
   * @minLength 8
   * @example "Password123"
   */
  password: string;
}

export interface RegisterDto {
  /**
   * Username
   * @example "johndoe"
   */
  username: string;
  /**
   * Email address
   * @example "john@example.com"
   */
  email: string;
  /**
   * Password
   * @minLength 8
   * @example "Password123"
   */
  password: string;
  /**
   * First name
   * @example "John"
   */
  name?: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastname?: string;
}

export interface ChangePasswordDto {
  /**
   * Old Password
   * @example "oldPassword1234"
   */
  oldPassword: string;
  /**
   * New Password
   * @minLength 6
   * @example "NewPassword1234"
   */
  newPassword: string;
}

export interface InviteUserToOrganizationDto {
  /**
   * Email (or username if supported) of the user who will receive the invitation.
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Unique identifier of the organization the user is being invited to. Must exist in the system.
   * @example "b72ce18d-1c62-4df7-9c55-43c29b5dc1f4"
   */
  organizationId: string;
  /**
   * Role that will be assigned to the invited user within the organization. If omitted, a default role may be applied (editor).
   * @example "editor"
   */
  role?: string;
}

export interface EjectUserFromOrganizationDto {
  /**
   * Unique identifier of the user to be ejected from the organization. Must exist in the system.
   * @example "a12bc34d-5e6f-7g8h-9i01-jk2lmno3p4qr"
   */
  ejectUserId: string;
  /**
   * Unique identifier of the organization the user is being invited to. Must exist in the system.
   * @example "b72ce18d-1c62-4df7-9c55-43c29b5dc1f4"
   */
  organizationId: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<
  D extends unknown,
  E extends unknown = unknown,
> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title CMS - testimonial
 * @version 1.0.0
 * @contact
 *
 * API para gestionar testimonios, usuarios y contenido del CMS.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindMe
     * @summary Get user entity of authenticated user
     * @request GET:/users/me
     * @secure
     */
    usersControllerFindMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdateMe
     * @summary Update authenticated user
     * @request PATCH:/users/me
     * @secure
     */
    usersControllerUpdateMe: (
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  testimonials = {
    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerCreate
     * @summary Create a testimonial with or without media attachment
     * @request POST:/testimonials
     */
    testimonialsControllerCreate: (
      query: {
        token: string;
      },
      data: CreateTestimonialDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/testimonials`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerFindAll
     * @summary Retrieve a list of testimonials with optional filtering and pagination
     * @request GET:/testimonials
     * @secure
     */
    testimonialsControllerFindAll: (
      query: {
        /**
         * Page number for pagination.
         * @default 1
         * @example "1"
         */
        page?: number;
        /**
         * Items per page.
         * @default 10
         * @example "10"
         */
        itemsPerPage?: number;
        /**
         * Sort items by date.
         * @default "ASC"
         * @example "ASC"
         */
        sort?: string;
        /**
         * ID of the organization to get testimonials.
         * @example "61dd833b-54df-407e-b9e7-b8e1a5484c8d"
         */
        organizationId: string;
        /**
         * Status to filter testimonials (e.g., approved, pending, rejected,published).
         * @example "approved"
         */
        status?: string;
        /**
         * Stars rating (1 to 5)
         * @min 1
         * @max 5
         */
        startsRating?: number;
        /** Filter testimonials created from this date (ISO) */
        createdFrom?: string;
        /** Filter testimonials created until this date (ISO) */
        createdTo?: string;
        /** Filter testimonials that match any of the provided tags */
        tags?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<TestimonialResponseDto[], any>({
        path: `/testimonials`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerWallTestimonials
     * @summary Retrieve a list of published testimonials of an organization
     * @request GET:/testimonials/wall
     */
    testimonialsControllerWallTestimonials: (
      query: {
        /**
         * Page number for pagination.
         * @default 1
         * @example "1"
         */
        page?: number;
        /**
         * Items per page.
         * @default 10
         * @example "10"
         */
        itemsPerPage?: number;
        /**
         * Sort items by date.
         * @default "ASC"
         * @example "ASC"
         */
        sort?: string;
        /**
         * ID of the organization to get testimonials.
         * @example "61dd833b-54df-407e-b9e7-b8e1a5484c8d"
         */
        organizationId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TestimonialResponseDto[], any>({
        path: `/testimonials/wall`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerInviteTestimonials
     * @summary Invite an end customer (or many) to submit a testimonial.
     * @request POST:/testimonials/invite
     * @secure
     */
    testimonialsControllerInviteTestimonials: (
      data: InviteTestimonialDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/testimonials/invite`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerAcceptInvitationTestimonial
     * @request GET:/testimonials/accept-invitation
     */
    testimonialsControllerAcceptInvitationTestimonial: (
      query: {
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/testimonials/accept-invitation`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerFindOne
     * @request GET:/testimonials/{id}
     * @secure
     */
    testimonialsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/testimonials/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerRemove
     * @request DELETE:/testimonials/{id}
     * @secure
     */
    testimonialsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/testimonials/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Testimonials
     * @name TestimonialsControllerChangeStatus
     * @summary Change status for a testimonial
     * @request POST:/testimonials/change-status
     * @secure
     */
    testimonialsControllerChangeStatus: (
      data: ChangeStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/testimonials/change-status`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  categories = {
    /**
     * No description
     *
     * @tags Categories
     * @name CategoriesControllerFindAll
     * @request GET:/categories
     * @secure
     */
    categoriesControllerFindAll: (
      query?: {
        /**
         * Page number for pagination.
         * @default 1
         * @example "1"
         */
        page?: number;
        /**
         * Items per page.
         * @default 10
         * @example "10"
         */
        itemsPerPage?: number;
        /**
         * Sort items by date.
         * @default "ASC"
         * @example "ASC"
         */
        sort?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/categories`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name CategoriesControllerFindOne
     * @request GET:/categories/{id}
     * @secure
     */
    categoriesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/categories/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  organizations = {
    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerCreate
     * @summary Create an organization. For upload a logo image, send a "file" field in multipart/form-data.
     * @request POST:/organizations
     * @secure
     */
    organizationsControllerCreate: (
      data: CreateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerFindUserOrganizations
     * @summary Retrieve a list of user's organizations
     * @request GET:/organizations
     * @secure
     */
    organizationsControllerFindUserOrganizations: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerFindOne
     * @request GET:/organizations/{id}
     * @secure
     */
    organizationsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/organizations/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerUpdate
     * @request PATCH:/organizations/{id}
     * @secure
     */
    organizationsControllerUpdate: (
      id: string,
      data: UpdateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerRemove
     * @request DELETE:/organizations/{id}
     * @secure
     */
    organizationsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/organizations/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerAddUserToOrganization
     * @request POST:/organizations/{orgId}/users
     * @secure
     */
    organizationsControllerAddUserToOrganization: (
      orgId: string,
      data: AddUserOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations/${orgId}/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerChangeUserRole
     * @request PATCH:/organizations/{orgId}/users/{userId}/role
     * @secure
     */
    organizationsControllerChangeUserRole: (
      orgId: string,
      userId: string,
      data: ChangeRoleDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations/${orgId}/users/${userId}/role`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsControllerRemoveUserFromOrganization
     * @request DELETE:/organizations/{orgId}/users/{userId}
     * @secure
     */
    organizationsControllerRemoveUserFromOrganization: (
      orgId: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations/${orgId}/users/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  tags = {
    /**
     * No description
     *
     * @tags Tags
     * @name TagsControllerCreate
     * @request POST:/tags
     */
    tagsControllerCreate: (data: CreateTagDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tags`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tags
     * @name TagsControllerFindAll
     * @request GET:/tags
     */
    tagsControllerFindAll: (
      query?: {
        /**
         * Page number for pagination.
         * @default 1
         * @example "1"
         */
        page?: number;
        /**
         * Items per page.
         * @default 10
         * @example "10"
         */
        itemsPerPage?: number;
        /**
         * Sort items by date.
         * @default "ASC"
         * @example "ASC"
         */
        sort?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tags`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tags
     * @name TagsControllerFindOne
     * @request GET:/tags/{id}
     */
    tagsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tags/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tags
     * @name TagsControllerUpdate
     * @request PATCH:/tags/{id}
     */
    tagsControllerUpdate: (
      id: string,
      data: UpdateTagDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tags/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tags
     * @name TagsControllerRemove
     * @request DELETE:/tags/{id}
     */
    tagsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tags/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerChangePassword
     * @request PATCH:/auth/change-password
     * @secure
     */
    authControllerChangePassword: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/auth/change-password`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerValidateToken
     * @request GET:/auth/validate-token
     * @secure
     */
    authControllerValidateToken: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/validate-token`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerConfirmEmail
     * @request GET:/auth/confirm-email
     */
    authControllerConfirmEmail: (token: string, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/auth/confirm-email`,
        method: "GET",
        ...params,
      }),
  };
  organizationManagement = {
    /**
     * No description
     *
     * @tags OrganizationManagement
     * @name OrganizationManagementControllerInviteUser
     * @summary Invite a user to organization
     * @request POST:/organization-management/invite
     * @secure
     */
    organizationManagementControllerInviteUser: (
      data: InviteUserToOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organization-management/invite`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrganizationManagement
     * @name OrganizationManagementControllerAcceptInvitation
     * @summary Accept invitation by token query
     * @request GET:/organization-management/invite
     */
    organizationManagementControllerAcceptInvitation: (
      query: {
        /** Token received by email */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void>({
        path: `/organization-management/invite`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrganizationManagement
     * @name OrganizationManagementControllerEjectUserFromOrganization
     * @summary Eject user from organization
     * @request POST:/organization-management/eject-user
     * @secure
     */
    organizationManagementControllerEjectUserFromOrganization: (
      data: EjectUserFromOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organization-management/eject-user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  health = {
    /**
     * No description
     *
     * @tags Health
     * @name HealthControllerHealthCheck
     * @request GET:/health
     */
    healthControllerHealthCheck: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/health`,
        method: "GET",
        ...params,
      }),
  };
}
