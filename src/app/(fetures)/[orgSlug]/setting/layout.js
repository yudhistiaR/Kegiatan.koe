const SettingLayout = ({ children }) => {
  return (
    <div className="h-full w-full flex gap-8">
      <div className="flex-1">
        <div>{children}</div>
      </div>
    </div>
  )
}

export default SettingLayout
