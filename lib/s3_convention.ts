/* 
Safe characters
The following character sets are generally safe for use in key names.

Alphanumeric characters	
- 0-9
- a-z
- A-Z

Special characters	
- Exclamation point (!)
- Hyphen (-)
- Underscore (_)
- Period (.)
- Asterisk (*)
- Single quote (')
- Open parenthesis (()
- Close parenthesis ())

See also:
- Github supabase/storage at src/storage/limits.ts
- Link: https://github.com/supabase/storage/blob/1abf34e2fc5b5792339a76b52802c2e69f98f35f/src/storage/limits.ts#L46
export function isValidKey(key: string): boolean {
    // only allow s3 safe characters and characters which require special handling for now
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    return key.length > 0 && /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key)
  }
*/

export const safeCharacters = '0-9a-zA-Z!-_.*\'()';

export const safeCharactersRegex = new RegExp(`^[${safeCharacters}]+$`);

export const normalizeFileNameForS3 = (fileName: string) => {
    return fileName.replace(/[^a-zA-Z0-9!-_.*'()]/g, '');
}