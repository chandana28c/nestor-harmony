interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

const ContextHeader = ({ headline, subtext }: ContextHeaderProps) => {
  return (
    <section className="px-3 py-3 border-b border-border">
      <h1 className="font-serif text-heading-lg font-bold text-foreground">{headline}</h1>
      <p className="text-body text-muted-foreground mt-1">{subtext}</p>
    </section>
  );
};

export default ContextHeader;
