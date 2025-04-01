/** 環境変数より文字列値を取得する・環境変数が存在しなければデフォルト値を使用する */
const getStringValue = (envName: string, defaultValue: string): string => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getStringValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const stringValue = process.env[envName]!;
  console.log(`configuration#getStringValue()  : Env [${envName}] = [${stringValue}]`);
  return stringValue;
};

/** 環境変数より値を取得し数値型で返す・環境変数が存在しないか数値型に変換できない場合はデフォルト値を使用する */
const getNumberValue = (envName: string, defaultValue: number): number => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getNumberValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const rawValue = process.env[envName]!;
  const numberValue = Number(rawValue);
  if(Number.isNaN(numberValue)) {
    console.log(`configuration#getNumberValue()  : Env [${envName}] value is NaN [${rawValue}]. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  console.log(`configuration#getNumberValue()  : Env [${envName}] = [${numberValue}]`);
  return numberValue;
};

/** 環境変数より値が設定されているか否かで Boolean 値を返す */
const getBooleanValue = (envName: string): boolean => {
  const isTruthy = process.env[envName] != null;
  console.log(`configuration#getBooleanValue() : Env [${envName}] = [${isTruthy}]`);
  return isTruthy;
};

/** 環境変数のオブジェクトを返す : この関数内にオブジェクトを定義しないと環境変数が読み込まれない */
export const configuration = (): { [key: string]: string | number | boolean } => ({
  noColour : getBooleanValue('NO_COLOR'                        ),  // ロガーの色付けをしない : NestJS のロガー `cli-colors.util.js` と同じ環境変数名・確認のため宣言
  port     : getNumberValue ('MIKIJS_PORT'      , 2180         ),  // ポート番号
  jwtSecret: getStringValue ('MIKIJS_JWT_SECRET', 'CHANGE-THIS'),  // JWT 認証シークレット
  dbHost   : getStringValue ('MIKIJS_DB_HOST'   , 'localhost'  ),  // DB ホスト
  dbPort   : getNumberValue ('MIKIJS_DB_PORT'   , 2183         ),  // DB ポート
  dbUser   : getStringValue ('MIKIJS_DB_USER'   , 'CHANGE-THIS'),  // DB ユーザ名
  dbPass   : getStringValue ('MIKIJS_DB_PASS'   , 'CHANGE-THIS'),  // DB パスワード
  dbName   : getStringValue ('MIKIJS_DB_NAME'   , 'mikijs'     ),  // DB データベース名
  adminPass: getStringValue ('MIKIJS_ADMIN_PASS', 'CHANGE-THIS')   // 管理者パスワード
});
