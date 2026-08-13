export type Dict<
    T = any,
    U extends string | number | symbol = string,
    V extends boolean = true,
> = V extends true
    ? {
          [key in U]: T;
      }
    : {
          [key in U]?: T;
      };
