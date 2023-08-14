#include <stdio.h>

void hi()
{
  printf("%s", "hi");
}

struct String
{
  char *str;
  // int len;
};

String create_string(char *str){
  struct String s;
  s.str = str;
  return s;
}

int main()
{
  struct String path;
  path.str = "../tmp/2015-1-input.txt";

  FILE *fptr;

  // Open a file in read mode
  fptr = fopen("../tmp/2015-1-input.txt", "r");

  // Check if the file is open:
  if (fptr == NULL)
  {
    printf("Cannot open file \n");
    return 1;
  }

  // Read contents from file
  char c = fgetc(fptr);
  while (c != EOF)
  {
    printf("%c", c);
    c = fgetc(fptr);
  }

  // int a = 20;
  // printf("%d", 20);
  // for (int i = 0; i < 20; i++) {
  //   printf("%d\n", i);
  // }
  // hi();
  return 0;
}
