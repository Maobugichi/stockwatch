export const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg text-xs sm:text-sm">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-gray-600">
                        Value: {data.displayValue}
                    </p>
                    <p className="text-gray-600">
                        Share: {data.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };
