import React from "react";
import {
  Card as UiCard,
  CardContent as UiCardContent,
  CardHeader as UiCardHeader,
  CardTitle as UiCardTitle,
} from "src/components/ui/card";
import {
  Trophy as TrophyOutlined,
  Clock as ClockCircleOutlined,
  FlaskConical as ExperimentOutlined,
} from "lucide-react";
const cx = (...classes) => classes.filter(Boolean).join(" ");
const Card = ({ title, children, className = "", style, ...props }) => (
  <UiCard className={className} style={style} {...props}>
    {title && (
      <UiCardHeader>
        <UiCardTitle>{title}</UiCardTitle>
      </UiCardHeader>
    )}
    <UiCardContent>{children}</UiCardContent>
  </UiCard>
);
Card.Meta = ({ title, description, avatar, className = "" }) => (
  <div className={cx("flex items-start gap-3", className)}>
    {avatar}
    <div>
      {title && <div className="font-medium">{title}</div>}
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  </div>
);
const Typography = {
  Title: ({ level = 3, children, className = "", ...props }) => {
    const Heading = `h${level}`;
    return (
      <Heading className={cx("font-semibold", className)} {...props}>
        {children}
      </Heading>
    );
  },
  Text: ({ children, className = "", ...props }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Paragraph: ({ children, className = "", ...props }) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
};
const Statistic = ({
  title,
  value,
  prefix,
  suffix,
  className = "",
  ...props
}) => (
  <div className={className} {...props}>
    {title && <div className="text-sm text-muted-foreground">{title}</div>}
    <div className="text-2xl font-semibold">
      {prefix}
      {value}
      {suffix}
    </div>
  </div>
);

const { Text } = Typography;

export function TrainResultSummaryCards({ metrics, experiment, epoch }) {
  const mainMetric = metrics[0];
  const totalMinutes = experiment.actual_training_time || 0;
  const mins = Math.floor(totalMinutes);
  const secs = Math.round((totalMinutes - mins) * 60);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 transition-all duration-300">
        <Statistic
          title={
            <span className="text-gray-600 dark:text-gray-400">
              {`Final ${mainMetric?.metric ?? "metric"} score`}
            </span>
          }
          value={(mainMetric?.value ?? 0) * 100}
          precision={2}
          prefix={
            <TrophyOutlined className="text-blue-600 dark:text-blue-400" />
          }
          suffix="%"
          valueStyle={{
            color: "rgb(37, 99, 235)",
            fontWeight: "bold",
          }}
        />
      </Card>

      <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 transition-all duration-300\">
        <Statistic
          title={
            <span className="text-gray-600 dark:text-gray-400">
              Training Duration
            </span>
          }
          valueRender={() => (
            <Text className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {mins}m {secs}s
            </Text>
          )}
          prefix={
            <ClockCircleOutlined className="text-amber-500 dark:text-amber-400" />
          }
        />
      </Card>

      <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 transition-all duration-300">
        <Statistic
          title={
            <span className="text-gray-600 dark:text-gray-400">
              Total Epochs
            </span>
          }
          value={epoch ?? 0}
          prefix={
            <ExperimentOutlined className="text-blue-600 dark:text-blue-400" />
          }
          valueStyle={{
            color: "rgb(37, 99, 235)",
            fontWeight: "bold",
          }}
        />
      </Card>
    </div>
  );
}
