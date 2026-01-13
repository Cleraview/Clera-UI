import { TypographyToken, typographyTokens } from './typography-tokens'
import { CodeToken } from '../_components/CodeToken'

const TypographyTable = ({ list }: { list: TypographyToken }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-space-sm">{list.title} List</h3>

      <div className="grid grid-cols-[150px_1fr_150px_150px] font-bold border-b-2 border-ds-default">
        <p>Preview</p>
        <p>Token</p>
        <p>Size</p>
        <p>Line Height</p>
      </div>

      <div className="flex flex-col">
        {list.tokens.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[150px_1fr_150px_150px] items-center py-space-sm border-b border-ds-default"
          >
            <div>
              <label className={item.token}>Aa</label>
            </div>
            <div>
              <CodeToken token={item.token as string} />
            </div>
            <div>
              <label>{item.fontSize}</label>
            </div>
            <div>
              <label>{item.lineHeight}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const TypographyHeadingList = () => {
  const [headings] = typographyTokens
  return <TypographyTable list={headings} />
}

export const TypographyBodyList = () => {
  const [, body] = typographyTokens
  return <TypographyTable list={body} />
}

export const TypographyCaptionList = () => {
  const [, , caption] = typographyTokens
  return <TypographyTable list={caption} />
}

export const TypographyLabelList = () => {
  const [, , , labels] = typographyTokens
  return <TypographyTable list={labels} />
}

export const TypographyCodeList = () => {
  const [, , , , codeLinks] = typographyTokens
  return <TypographyTable list={codeLinks} />
}

export const TypographyTextStylesList = () => {
  const [, , , , , textStyles] = typographyTokens
  return <TypographyTable list={textStyles} />
}
