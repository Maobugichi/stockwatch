export const UpdatedAt = ({minutesAgo}:{minutesAgo:number}) => {
    return(
        <>
          {minutesAgo > 0 && (
            <p className="text-xs text-muted-foreground">
                Last updated {minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago
            </p>
           )}
        </>
    )
}