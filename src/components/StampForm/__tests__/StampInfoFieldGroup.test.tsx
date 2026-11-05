import { render, screen, userEvent, within } from '@/__tests__/test-utils';

import { type StampFormContextValue, useStampFormContext } from '../StampForm';
import { StampInfoFieldGroup } from '../StampInfoFieldGroup';

vi.mock('../StampForm', () => ({
  useStampFormContext: vi.fn(),
}));

type Stamp = NonNullable<StampFormContextValue['stamp']>;

const createStamp = (overrides: Partial<Stamp>): Stamp => ({
  _count: { likedBy: 0 },
  capital: null,
  category: 'general',
  changedAt: new Date('2026-11-05T00:00:00Z'),
  createdAt: '1 day ago',
  downloads: 0,
  game: '117',
  good: null,
  id: 'test-stamp',
  images: [],
  markdownDescription: '',
  modded: false,
  region: 'latium',
  stampFileUrl: '/test-stamp.zip',
  suffixDownloads: '0',
  title: 'Test stamp',
  unsafeDescription: '',
  updatedAt: '1 day ago',
  userId: 'test-user',
  ...overrides,
});

const renderStampInfo = (game: string, stamp?: Stamp) => {
  vi.mocked(useStampFormContext).mockReturnValue({
    files: [],
    images: [],
    setFiles: vi.fn(),
    setImages: vi.fn(),
    setStatus: vi.fn(),
    stamp,
    status: 'idle',
  });

  return {
    ...render(
      <form aria-label="Stamp information">
        <StampInfoFieldGroup game={game} />
      </form>,
    ),
    user: userEvent.setup(),
  };
};

describe.each([
  {
    capitals: ['cinis'],
    game: '117',
    regions: ['latium', 'albion'],
  },
  {
    capitals: ['crown falls', 'manola'],
    game: '1800',
    regions: ['old world', 'new world', 'arctic', 'enbesa'],
  },
])('StampInfoFieldGroup for Anno $game', ({ capitals, game, regions }) => {
  it('requires a region and offers only regions for the selected game', () => {
    renderStampInfo(game);

    const region = screen.getByRole('combobox', { name: 'Region' });

    expect(region).toBeRequired();
    expect(region).toHaveValue('');
    expect(region).toBeInvalid();
    expect(
      within(region).getByRole('option', { name: 'Select a region…' }),
    ).toBeDisabled();
    expect(within(region).getAllByRole('option')).toHaveLength(
      regions.length + 1,
    );
    for (const value of regions) {
      expect(within(region).getByRole('option', { name: value })).toHaveValue(
        value,
      );
    }
    expect(
      screen.queryByRole('textbox', { name: 'Enter Good' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Capital' }),
    ).not.toBeInTheDocument();
  });

  it('shows a required good for production and includes its value in form data', async () => {
    const { user } = renderStampInfo(game);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Category' }),
      'production',
    );

    const good = screen.getByRole('textbox', { name: 'Enter Good' });
    expect(good).toBeRequired();
    expect(good).toHaveValue('');
    expect(good).toBeInvalid();
    expect(
      screen.queryByRole('combobox', { name: 'Capital' }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Region' }),
      regions[0],
    );
    await user.type(good, 'Bread');

    const formData = new FormData(screen.getByRole<HTMLFormElement>('form'));
    expect(formData.get('category')).toBe('production');
    expect(formData.get('region')).toBe(regions[0]);
    expect(formData.get('good')).toBe('Bread');
    expect(formData.has('capital')).toBe(false);
  });

  it('offers optional game-specific capitals for islands, including Not capital', async () => {
    const { user } = renderStampInfo(game);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Category' }),
      'island',
    );

    const capital = screen.getByRole('combobox', { name: 'Capital' });
    expect(capital).not.toBeRequired();
    expect(capital).toHaveValue('');
    expect(within(capital).getAllByRole('option')).toHaveLength(
      capitals.length + 1,
    );
    expect(
      within(capital).getByRole('option', { name: 'Not capital' }),
    ).toHaveValue('');
    for (const value of capitals) {
      expect(within(capital).getByRole('option', { name: value })).toHaveValue(
        value,
      );
      await user.selectOptions(capital, value);
      expect(
        new FormData(screen.getByRole<HTMLFormElement>('form')).get('capital'),
      ).toBe(value);
    }

    await user.selectOptions(capital, '');
    expect(capital).toHaveValue('');
    expect(
      new FormData(screen.getByRole<HTMLFormElement>('form')).get('capital'),
    ).toBe('');
    expect(
      screen.queryByRole('textbox', { name: 'Enter Good' }),
    ).not.toBeInTheDocument();
  });

  it('removes irrelevant fields and their form values when the category changes', async () => {
    const { user } = renderStampInfo(game);
    const category = screen.getByRole('combobox', { name: 'Category' });

    await user.selectOptions(category, 'production');
    await user.type(
      screen.getByRole('textbox', { name: 'Enter Good' }),
      'Bread',
    );
    await user.selectOptions(category, 'island');
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Capital' }),
      capitals[0],
    );

    expect(
      screen.queryByRole('textbox', { name: 'Enter Good' }),
    ).not.toBeInTheDocument();
    expect(
      new FormData(screen.getByRole<HTMLFormElement>('form')).has('good'),
    ).toBe(false);

    await user.selectOptions(category, 'general');

    expect(
      screen.queryByRole('combobox', { name: 'Capital' }),
    ).not.toBeInTheDocument();
    expect(
      new FormData(screen.getByRole<HTMLFormElement>('form')).has('capital'),
    ).toBe(false);
    expect(screen.getByRole('combobox', { name: 'Region' })).toBeRequired();
  });

  it('prefills the region and good when editing a production stamp', () => {
    renderStampInfo(
      game,
      createStamp({
        category: 'production',
        game,
        good: 'Bread',
        region: regions[1],
      }),
    );

    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue(
      'production',
    );
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue(
      regions[1],
    );
    expect(screen.getByRole('textbox', { name: 'Enter Good' })).toHaveValue(
      'Bread',
    );
  });

  it('prefills the region and capital when editing an island stamp', () => {
    renderStampInfo(
      game,
      createStamp({
        capital: capitals[0],
        category: 'island',
        game,
        region: regions[0],
      }),
    );

    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue(
      'island',
    );
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue(
      regions[0],
    );
    expect(screen.getByRole('combobox', { name: 'Capital' })).toHaveValue(
      capitals[0],
    );
  });
});
